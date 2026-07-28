using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

//using gkb_service.Controllers.DBcontext;
using gkb_service.Controllers.Mail_service;
using gkb_service.Model;
using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using snapdough_api.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace gkb_service.Controllers.AuthApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {

        private readonly IConfiguration _config;
        //private readonly UserManager<IdentityUser> _usermanager;
        //private readonly SignInManager<IdentityUser> _signmanager;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly EmailOtpService _emailOtpService;
        private readonly AppDbContext _context;
        //private readonly IDistributedCache _rediscache;
        public AuthApiController(IConfiguration config,
            //UserManager<IdentityUser> usermanager, SignInManager<IdentityUser> signmanager, 
            IConfiguration configuration, IMemoryCache cache, EmailOtpService emailOtpService, AppDbContext context
            //IDistributedCache rediscache
            )
        {
            _config = config;
            //_signmanager = signmanager;
            //_usermanager = usermanager;
            _configuration = configuration;
            _cache = cache;
            _emailOtpService = emailOtpService;
            _context = context;
            //_rediscache = rediscache;
        }


        // GET: api/<AuthApiController>
        [HttpGet]
        public async Task<IEnumerable<string>> Get()
        {
            string cache_key = "testing";
            //var check_cache = _rediscache.GetString(cache_key);
            //if (check_cache == null)
            //{
            //    var result = await _context.Database.SqlQueryRaw<int>("SELECT 1").ToListAsync();
            //    int myNumber = result.FirstOrDefault();
            //    _rediscache.SetString("testing", JsonConvert.SerializeObject(new { value1 = "value1", value2 = myNumber.ToString() }));
            //    return new string[] { "value1", myNumber.ToString() };

            //}
            //else
            //{
            //    return new string[] { "value1", JsonConvert.DeserializeObject<object>(check_cache)?.ToString().Split(',')?.LastOrDefault() ?? "1" };
            //}
            // This will actually return the number 1!

            return null;
        }

        // GET api/<AuthApiController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<AuthApiController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AuthApiController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AuthApiController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [Authorize]
        [HttpGet]
        [Route("Home")]
        public IActionResult Home()
        {
            try
            {
                return Ok(new
                {
                    Home = "ok"
                });
            }
            catch(Exception ex)
            {
                return Ok(new
                {
                    error = ex.Message.ToString()
                });
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel Data)
        {
            try
            {
                if (string.IsNullOrEmpty(Data.Email) || string.IsNullOrEmpty(Data.Password))
                {
                    return BadRequest(new { error = "Email and password are required" });
                }

                var user = await _context.UserMasters.FirstOrDefaultAsync(u => u.Email == Data.Email);
                if (user == null)
                {
                    return Unauthorized(new { error = "Invalid email or password" });
                }

                if (user.Active != 1)
                {
                    return Unauthorized(new { error = "User account is inactive" });
                }

                // Verify hash
                string computedHash = gkb_service.Helpers.PasswordHasher.HashPassword(Data.Password, user.SaltValue);
                if (computedHash != user.HashValue)
                {
                    return Unauthorized(new { error = "Invalid email or password" });
                }

                var token = Gjwttoken(user.Username ?? user.Email, user.UserId, user.RoleId);

                return Ok(new
                {
                    token = token,
                    userId = user.UserId,
                    roleId = user.RoleId,
                    username = user.Username,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }


        [HttpPost]
        [Route("GenerateOtp")]
        public async Task<IActionResult> GenerateOtp([FromBody] OtpRequest request)
        {
            try
            {
                long otp = await _emailOtpService.generateAndSendOtp(request.Email);
                _cache.Set(request.Email, otp, TimeSpan.FromMinutes(5)); // Cache OTP for 5 minutes
                if (otp == 0)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Error generating OTP for {request.Email}");
                }
                else
                {
                    Console.WriteLine($"OTP generated for {request.Email}: {otp}");
                    return Ok($"OTP generated and sent to {request.Email}");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine("ex.StackTrace: " + ex.StackTrace + "\n ex.Message: " + ex.Message + "\n ex.InnerException: " + ex.InnerException + "\n");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error generating OTP: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel Data)
        {
            try
            {
                if (string.IsNullOrEmpty(Data.Email) || string.IsNullOrEmpty(Data.Password) || string.IsNullOrEmpty(Data.Username))
                {
                    return BadRequest(new { error = "Username, email, and password are required" });
                }

                var existing = await _context.UserMasters.FirstOrDefaultAsync(u => u.Email == Data.Email);
                if (existing != null)
                {
                    return BadRequest(new { error = "Email is already registered" });
                }

                string salt = gkb_service.Helpers.PasswordHasher.GenerateSalt();
                string hash = gkb_service.Helpers.PasswordHasher.HashPassword(Data.Password, salt);

                var user = new UserMaster
                {
                    Username = Data.Username,
                    Email = Data.Email,
                    SaltValue = salt,
                    HashValue = hash,
                    HouseNo = Data.HouseNo,
                    AddressLine1 = Data.AddressLine1,
                    AddressLine2 = Data.AddressLine2,
                    Area = Data.Area,
                    State = Data.State,
                    Mobile = Data.Mobile,
                    RoleId = 2, // Customer
                    Active = 1,
                    CreatedOn = DateTime.UtcNow
                };

                _context.UserMasters.Add(user);
                await _context.SaveChangesAsync();

                // Now that we have UserId, encrypt the password column using the UserId as a symmetric key
                user.Password = gkb_service.Helpers.PasswordHasher.EncryptPasswordByUserId(Data.Password, user.UserId);
                _context.UserMasters.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "succed",
                    userId = user.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }


        private string Gjwttoken(string username, int userId, int roleId)
        {
            var skey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var cr = new SigningCredentials(skey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, username),
                new Claim("userId", userId.ToString()),
                new Claim("roleId", roleId.ToString()),
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, roleId == 1 ? "Admin" : "Customer")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // Extended to 2 hours
                signingCredentials: cr);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string HouseNo { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Area { get; set; }
        public string State { get; set; }
        public string Mobile { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
