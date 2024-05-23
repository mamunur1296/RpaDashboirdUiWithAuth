using Microsoft.AspNetCore.Mvc;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Controllers
{
    public class ChapterController : Controller
    {
        private readonly IClientServices<Chapter> _clientServices;

        // Constructor to initialize the controller with required services
        public ChapterController(IClientServices<Chapter> clientServices)
        {
            _clientServices = clientServices;
        }

        // Action to display the index view
        public async Task<IActionResult> Index()
        {
            return View();
        }

        // Action to create a new ApplicationUser
        [HttpPost]
        public async Task<IActionResult> Create(Chapter model)
        {
            var response = await _clientServices.PostClientAsync("api/Chapter/Create", model);
            if (response.Success && (response.Status == 200 || response.Status == 201))
            {
                return Json(true);
            }

            return Json(false);
        }

        // Action to get all ApplicationUser entities
        public async Task<IActionResult> GetAll()
        {
            var chapters = await _clientServices.GetAllClientsAsync("api/Chapter/getAllChapter");
            return Json(chapters);
        }

        // Action to delete an ApplicationUser by ID
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var chapter = await _clientServices.DeleteClientAsync($"api/Chapter/DeleteChapter/{id}");
            if (chapter.Success)
            {
                return Json(true);
            }
            return Json(false);
        }

        // Action to get details of an ApplicationUser by ID
        public async Task<IActionResult> GetById(Guid id)
        {
            var chapter = await _clientServices.GetClientByIdAsync($"api/Chapter/getChapter/{id}");
            return Json(chapter);
        }

        // Action to edit an ApplicationUser profile
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Chapter model)
        {
            var chapter = await _clientServices.UpdateClientAsync($"api/Chapter/UpdateChapter/{id}", model);
            if (chapter.Success)
            {
                return Json(true);
            }

            return Json(false);
        }
    }
}
