namespace gkb_service.Controllers.Middleware
{
    public class Maintenance_instance
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        // The _next parameter represents the next middleware in the pipeline
        public Maintenance_instance(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync (HttpContext context)
        {
            // 1. Read the toggle from appsettings.json
            // Check if the application is in maintenance mode
            bool isMaintenanceMode = _configuration.GetValue<bool>("MaintenanceMode:Enabled");

            // 2. If it's true, we short-circuit the pipeline!
            if (isMaintenanceMode)
            {
                // If in maintenance mode, return a 503 Service Unavailable response
                context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                string message = _configuration.GetValue<string>("MaintenanceMode:Message");
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "The service is currently under maintenance. Please try again later.",
                    message = message,
                    maintenance = isMaintenanceMode
                });

                return; // 🛑 We return IMMEDIATELY. We do NOT call _next.
            }
            else
            {
                // If not in maintenance mode, call the next middleware in the pipeline
                await _next(context);
            }
        }
    }
}
