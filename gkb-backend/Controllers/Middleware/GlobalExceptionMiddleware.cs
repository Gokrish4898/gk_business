using System.Net;
using System.Text.Json;
using gkb_service.Model;

namespace gkb_service.Controllers.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Pass the request down the pipeline to your controllers
                await _next(context);
            }
            catch (Exception ex)
            {
                // If ANYTHING fails, the execution bubbles back up to here
                _logger.LogError(ex, "An unhandled exception occurred during the request.");
                await HandleExceptionAsync(context, ex, _env);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception, IHostEnvironment env)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new ErrorResponse
            {
                StatusCode = context.Response.StatusCode,
                Message = "An unexpected error occurred while processing your request. Our technical team has been notified."
            };

            // If we are in development, show the actual crash details so you can debug.
            // If in production, keep it hidden for security.
            if (env.IsDevelopment())
            {
                response.Details = exception.StackTrace?.ToString();
            }

            // Serialize the standard response and send it to Angular
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return context.Response.WriteAsync(json);
        }
    }
}
