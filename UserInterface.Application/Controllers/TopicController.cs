using Microsoft.AspNetCore.Mvc;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Controllers
{
    public class TopicController : Controller
    {
        private readonly IClientServices<Topic> _clientServices;

        // Constructor to initialize the controller with required services
        public TopicController(IClientServices<Topic> clientServices)
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
        public async Task<IActionResult> Create(Topic model)
        {
            var topic = await _clientServices.PostClientAsync("api/Topic/Create", model);
            if (topic.Success && (topic.Status == 200 || topic.Status == 201))
            {
                return Json(true);
            }

            return Json(false);
        }

        // Action to get all ApplicationUser entities
        public async Task<IActionResult> GetAll()
        {
            var topics = await _clientServices.GetAllClientsAsync("api/Topic/getAllTopic");
            return Json(topics);
        }

        // Action to delete an ApplicationUser by ID
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var topic = await _clientServices.DeleteClientAsync($"api/Topic/DeleteTopic/{id}");
            if (topic.Success)
            {
                return Json(true);
            }
            return Json(false);
        }

        // Action to get details of an ApplicationUser by ID
        public async Task<IActionResult> GetById(Guid id)
        {
            var topic = await _clientServices.GetClientByIdAsync($"api/Topic/getTopic/{id}");
            return Json(topic);
        }

        // Action to edit an ApplicationUser profile
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Topic model)
        {
            var topic = await _clientServices.UpdateClientAsync($"api/Topic/UpdateTopic/{id}", model);
            if (topic.Success)
            {
                return Json(true);
            }

            return Json(false);
        }
    }
}
