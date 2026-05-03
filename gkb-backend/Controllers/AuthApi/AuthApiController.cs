using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using gkb_service.Controllers.Mail_service;
using gkb_service.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace gkb_service.Controllers.AuthApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {

        private readonly IConfiguration _config;
        private readonly UserManager<IdentityUser> _usermanager;
        private readonly SignInManager<IdentityUser> _signmanager;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly EmailOtpService _emailOtpService;
        public AuthApiController(IConfiguration config,UserManager<IdentityUser> usermanager, SignInManager<IdentityUser> signmanager, IConfiguration configuration, IMemoryCache cache, EmailOtpService emailOtpService)
        {
            _config = config;
            _signmanager = signmanager;
            _usermanager = usermanager;
            _configuration = configuration;
            _cache = cache;
            _emailOtpService = emailOtpService;

        }


        // GET: api/<AuthApiController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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
        public async Task<IActionResult> Login()
        {
            try
            {
                var token = Gjwttoken("Gokul");

                var obj_jwt = new JwtSecurityTokenHandler();

                //var  token = obj_jwt.cre

                return Ok(new
                {
                    token = token
                });
            }
            catch (Exception ex)
            {
                string errorMessage = ex.Message.ToString();
                return Ok(new
                {
                    error = errorMessage
                });
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
            string msg = "Failed";
            try
            {
                var user = new IdentityUser { UserName = Data.Email, Email = Data.Email };

                var result = await _usermanager.CreateAsync(user, Data.Password);

                if (result.Succeeded)
                {
                    msg = "succed";
                }

                return Ok(new
                {
                    message = msg
                });

            }catch(Exception ex)
            {
                return Ok(new
                {
                    error = ex.Message.ToString()
                });
            }
        }


    private string Gjwttoken(string username)
        {
            var skey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var cr = new SigningCredentials(skey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, username),
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role,"Admin")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: cr);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
