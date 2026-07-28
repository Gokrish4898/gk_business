using System.Collections.Generic;

namespace gkb_service.Model
{
    public class CityChargeItem
    {
        public string City { get; set; } = string.Empty;
        public List<PincodeChargeItem> Pincodes { get; set; } = new();
    }

    public class PincodeChargeItem
    {
        public string Pincode { get; set; } = string.Empty;
        public float Charge { get; set; }
    }
}
