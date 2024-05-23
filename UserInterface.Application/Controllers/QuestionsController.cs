using Microsoft.AspNetCore.Mvc;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Controllers
{
    public class QuestionsController : Controller
    {
        private readonly IClientServices<Questions> _clientServices;

        // Constructor to initialize the controller with required services
        public QuestionsController(IClientServices<Questions> clientServices)
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
        public async Task<IActionResult> Create(Questions model)
        {
            var questions = await _clientServices.PostClientAsync("api/Questions/Create", model);
            if (questions.Success && (questions.Status == 200 || questions.Status == 201))
            {
                return Json(true);
            }

            return Json(false);
        }

        // Action to get all ApplicationUser entities
        public async Task<IActionResult> GetAll()
        {
            var questions = await _clientServices.GetAllClientsAsync("api/Questions/getAllQuestions");
            return Json(questions);
        }

        // Action to delete an ApplicationUser by ID
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var questions = await _clientServices.DeleteClientAsync($"api/Questions/DeleteQuestions/{id}");
            if (questions.Success)
            {
                return Json(true);
            }
            return Json(false);
        }

        // Action to get details of an ApplicationUser by ID
        public async Task<IActionResult> GetById(Guid id)
        {
            var questions = await _clientServices.GetClientByIdAsync($"api/Questions/getQuestions/{id}");
            return Json(questions);
        }

        // Action to edit an ApplicationUser profile
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Questions model)
        {
            var questions = await _clientServices.UpdateClientAsync($"api/Questions/UpdateQuestions/{id}", model);
            if (questions.Success)
            {
                return Json(true);
            }

            return Json(false);
        }
    }
}
