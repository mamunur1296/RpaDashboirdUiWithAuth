namespace UserInterface.Application.Models.Base
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string? Created_By { get; set; }
        public string? Modified_By { get; set; }
    }
}
