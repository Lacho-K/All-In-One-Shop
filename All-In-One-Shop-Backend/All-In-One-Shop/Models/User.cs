using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [StringLength(50)]
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Token { get; set; }

        [StringLength(10)]
        public string? Role { get; set; }

        [StringLength(50)]
        public string? Email { get; set; }

        public int ShoppingCartId { get; set; }

        public ShoppingCart? ShoppingCart { get; set; }
    }
}
