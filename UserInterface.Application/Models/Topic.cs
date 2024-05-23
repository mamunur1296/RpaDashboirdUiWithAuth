using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using UserInterface.Application.Models.Base;

namespace UserInterface.Application.Models
{
    public class Topic : BaseEntity
    {
        [Required]
        [DisplayName("Topic Name")]
        public string title { get; set; }
        [Required]
        [DisplayName("Chapter Name")]
        public Guid Chapterid { get; set; }
        public List<Questions> QuestionsList { get; set; } = new List<Questions>();
    }
}
