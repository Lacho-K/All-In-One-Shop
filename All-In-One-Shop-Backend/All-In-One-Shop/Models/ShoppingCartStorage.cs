namespace All_In_One_Shop.Models
{
    public class ShoppingCartStorage
    {
        public int ShoppingCartId { get; set; }
        public ShoppingCart? ShoppingCart { get; set; }
        public int StorageId { get; set; }
        public Storage? Storage { get; set; }
    }
}
