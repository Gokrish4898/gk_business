//using gkb_service.Controllers.DBcontext;
using gkb_service.Controllers.Admin;
using gkb_service.Models;
using gkb_service.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//// 1. Register the SQLite Database
//builder.Services.AddDbContext<AppDbContext>(option => option.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

//// 2. Register ASP.NET Core Identity
//builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AppDbContext>();

//string connectionString = string.Empty;
//if (String.IsNullOrEmpty(builder.Configuration.GetValue<string>("DBconfig:dbconnection")))
//{

//}
//else
//{
//    var uri = new Uri(builder.Configuration.GetValue<string>("DBconfig:dbconnection").ToString());
//    var username = uri.UserInfo.Split(':')[0];
//    var password = uri.UserInfo.Split(':')[1];

//    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.LocalPath.Substring(1)};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
//}

// --- 2. REGISTER POSTGRESQL ---
//builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetValue<string>("DBconfig:DefaultConnection")));

//redis connection
//builder.Services.AddStackExchangeRedisCache(options => 
//{ 
//    options.Configuration = builder.Configuration.GetValue<string>("Redis:redisConnection"); 
//    options.InstanceName = "gkb_dev_cache"; 
//});

//builder.Services.AddHostedService<gkb_service.subscribe_class.Request_sub>()>

// 1. ADD THIS BLOCK to create the CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularUI", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://gokrish4898.github.io", "https://gokrish4898.github.io/gk_business/") // IMPORTANT: No trailing slash at the end!
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<gkb_service.Controllers.Mail_service.EmailOtpService>();
builder.Services.AddTransient<IRecipe, RecipeService>();
builder.Services.AddTransient<IStock, StockService>();
builder.Services.AddTransient<IEmailEventPublisher, EmailEventPublisher>();
builder.Services.AddTransient<IProduct,ProductService>();
builder.Services.AddTransient<IWishlist,WishlistService>();
builder.Services.AddTransient<IRating,RatingService>();
builder.Services.AddTransient<IRole,RoleService>();
builder.Services.AddTransient<IAdditionalCharge,AdditionalChargeService>();
builder.Services.AddTransient<IDeliveryCharge,DeliveryChargeService>();
builder.Services.AddTransient<IUserMaster,UserMasterService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
        };

        var secretKey = builder.Configuration["Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("Missing configuration value 'Jwt:SecretKey'.");

        options.TokenValidationParameters.IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(secretKey));
    });

var app = builder.Build();


// --- 3. auto-migrate & seed ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Seed PaymentMaster
        if (!db.PaymentMasters.Any())
        {
            db.PaymentMasters.AddRange(
                new PaymentMaster { PaymentName = "Cash On Delivery", Description = "Pay in cash upon delivery of your order", DisplayOrder = 1, CreatedOn = DateTime.UtcNow, Active = 1 },
                new PaymentMaster { PaymentName = "UPI", Description = "Google Pay, PhonePe, Paytm or any BHIM UPI app", DisplayOrder = 2, CreatedOn = DateTime.UtcNow, Active = 1 },
                new PaymentMaster { PaymentName = "Credit Card", Description = "Pay securely using your Visa, Mastercard or RuPay Credit Card", DisplayOrder = 3, CreatedOn = DateTime.UtcNow, Active = 1 },
                new PaymentMaster { PaymentName = "Debit Card", Description = "Pay securely using your Debit Card", DisplayOrder = 4, CreatedOn = DateTime.UtcNow, Active = 1 }
            );
            db.SaveChanges();
        }

        // Seed OrderStatusMaster
        if (!db.OrderStatusMasters.Any())
        {
            var statuses = new string[] {
                "Pending", "Confirmed", "Preparing", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled", "Rejected", "Returned", "Refunded"
            };
            foreach (var status in statuses)
            {
                db.OrderStatusMasters.Add(new OrderStatusMaster
                {
                    StatusName = status,
                    Description = $"Order has been marked as {status}",
                    CreatedOn = DateTime.UtcNow,
                    Active = 1
                });
            }
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding data: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// 2. ADD THIS LINE exactly here
app.UseCors("AllowAngularUI");
app.UseRouting();
app.UseMiddleware<gkb_service.Controllers.Middleware.Maintenance_instance>();
app.UseAuthentication(); // 1. The bouncer checks the ID (Validates JWT)
app.UseAuthorization();  // 2. The bouncer checks the VIP list (Checks Roles)

app.MapControllers();

app.Run();
