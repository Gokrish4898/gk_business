namespace gkb_service.Model
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        // Only populate this in development, never in production!
        public string? Details { get; set; }
    }
}
