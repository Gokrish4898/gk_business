using System.Text;
using MQTTnet;
using Newtonsoft.Json;

namespace gkb_service.Service
{
    public interface IEmailEventPublisher
    {
        Task<bool> PublishEvent<T>(string topic,T message);
    }

    public class EmailEventPublisher : IEmailEventPublisher
    {
        private readonly ILogger<EmailEventPublisher> _logger;
        private readonly IConfiguration configuration;
        public EmailEventPublisher(ILogger<EmailEventPublisher> logger, IConfiguration configuration)
        {
            _logger = logger;
            this.configuration = configuration;
        }
        public async Task<bool> PublishEvent<T>(string topic, T message)
        {
            try
            {
                _logger.LogInformation($"Published event to topic '{topic}': {message}");

                // Simulate publishing the event to a message broker or event bus
                var mqttfactory = new MqttClientFactory();
                using var mqttClient = mqttfactory.CreateMqttClient();

                //fecth the broker address and port from configuration or environment variables

                var mqttOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer(configuration.GetValue<string>("HiveMQ:Host"), configuration.GetValue<int>("HiveMQ:Port")) // Replace with your MQTT broker address and port
                    .WithCredentials(configuration.GetValue<string>("HiveMQ:Username"), configuration.GetValue<string>("HiveMQ:Password")) // Replace with your MQTT broker username and password
                    .WithCleanSession()
                    .WithKeepAlivePeriod(TimeSpan.FromSeconds(30))
                    .WithTlsOptions(tls=> tls.UseTls())
                    .WithClientId($"EmailEventPublisher-{Guid.NewGuid()}")
                    .Build();

                await mqttClient.ConnectAsync(mqttOptions, CancellationToken.None);

                string payload = JsonConvert.SerializeObject(message);

                var messageBuilder = new MqttApplicationMessageBuilder()
                    .WithTopic(topic)
                    .WithPayload(Encoding.UTF8.GetBytes(payload))
                    .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.AtLeastOnce)
                    .Build();

                await mqttClient.PublishAsync(messageBuilder, CancellationToken.None);

                await mqttClient.DisconnectAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish event to topic '{topic}': {message}");
                Console.WriteLine( $" {ex.Message}, {ex.StackTrace} Failed to publish event to topic '{topic}': {message}");
                return false;
            }
        }
    }
}
