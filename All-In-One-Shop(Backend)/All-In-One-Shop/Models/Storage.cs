using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class Storage
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        public Product? Product { get; set; }

        public int? ProductQuantity { get; set; } = 0;

        [StringLength(50)]
        public string ProductLocation { get; set; } = string.Empty;

        public string ProductRatings { get; set; } = string.Empty;
    }
}
