using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.subscribe_class
{
    public abstract class Request_sub : BackgroundService
    {
        //public Request_sub()
        //{
        //}
    
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Implement background work here.
            // If there's no background work, return a completed task:
            return Task.CompletedTask;
        }
    }
}
