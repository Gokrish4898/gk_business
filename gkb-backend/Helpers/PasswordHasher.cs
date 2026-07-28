using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace gkb_service.Helpers
{
    public static class PasswordHasher
    {
        // 1. Generate Salt (32-byte Base64)
        public static string GenerateSalt()
        {
            var saltBytes = new byte[32];
            using (var provider = RandomNumberGenerator.Create())
            {
                provider.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        // 2. Hash password with Salt (PBKDF2-HMACSHA256)
        public static string HashPassword(string password, string salt)
        {
            var saltBytes = Convert.FromBase64String(salt);
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
            {
                var hashBytes = pbkdf2.GetBytes(32);
                return Convert.ToBase64String(hashBytes);
            }
        }

        // 3. Encrypt Password by UserId using AES
        // We derive the AES key by hashing the string "UserId_" + userId
        public static string EncryptPasswordByUserId(string password, int userId)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;

            using (var aes = Aes.Create())
            {
                // Derive key & IV from the userId
                var keyMaterial = SHA256.HashData(Encoding.UTF8.GetBytes($"UserKeySalt_{userId}"));
                var ivMaterial = MD5.HashData(Encoding.UTF8.GetBytes($"UserIvSalt_{userId}"));

                aes.Key = keyMaterial;
                aes.IV = ivMaterial;

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        var plainBytes = Encoding.UTF8.GetBytes(password);
                        cs.Write(plainBytes, 0, plainBytes.Length);
                        cs.FlushFinalBlock();
                    }
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        // 4. Decrypt Password by UserId using AES
        public static string DecryptPasswordByUserId(string cipherText, int userId)
        {
            if (string.IsNullOrEmpty(cipherText)) return string.Empty;

            try
            {
                using (var aes = Aes.Create())
                {
                    var keyMaterial = SHA256.HashData(Encoding.UTF8.GetBytes($"UserKeySalt_{userId}"));
                    var ivMaterial = MD5.HashData(Encoding.UTF8.GetBytes($"UserIvSalt_{userId}"));

                    aes.Key = keyMaterial;
                    aes.IV = ivMaterial;

                    using (var ms = new MemoryStream(Convert.FromBase64String(cipherText)))
                    {
                        using (var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read))
                        {
                            using (var sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch
            {
                return "DecryptionFailed";
            }
        }
    }
}
