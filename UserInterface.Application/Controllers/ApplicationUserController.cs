using Microsoft.AspNetCore.Mvc;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Controllers
{
    // Controller for managing ApplicationUser entities
    public class ApplicationUserController : Controller
    {
        private readonly IClientServices<ApplicationUser> _clientServices;

        // Constructor to initialize the controller with required services
        public ApplicationUserController(IClientServices<ApplicationUser> clientServices)
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
        public async Task<IActionResult> Create(ApplicationUser user)
        {
            user.Roles = new List<string> { "User" };
            var response = await _clientServices.PostClientAsync("api/User/Create", user);
            if (response.Success && (response.Status == 200 || response.Status == 201))
            {
                return Json(true);
            }

            return Json(false);
        }

        // Action to get all ApplicationUser entities
        public async Task<IActionResult> GetAll()
        {
            var users = await _clientServices.GetAllClientsAsync("api/User/GetAll");
            return Json(users);
        }

        // Action to delete an ApplicationUser by ID
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var response = await _clientServices.DeleteClientAsync($"api/User/Delete/{id}");
            if (response.Success)
            {
                return RedirectToAction("GetAll");
            }

            ModelState.AddModelError(string.Empty, response.ErrorMessage);
            return View("GetAll");
        }

        // Action to get details of an ApplicationUser by ID
        public async Task<IActionResult> GetUserDetails(Guid id)
        {
            var user = await _clientServices.GetClientByIdAsync($"api/User/GetUserDetails/{id}");
            return View(user);
        }

        // Action to edit an ApplicationUser profile
        [HttpPost]
        public async Task<IActionResult> EditUserProfile(Guid id, ApplicationUser user)
        {
            if (ModelState.IsValid)
            {
                var response = await _clientServices.UpdateClientAsync($"api/User/EditUserProfile/{id}", user);
                if (response.Success)
                {
                    return RedirectToAction("GetUserDetails", new { id });
                }

                ModelState.AddModelError(string.Empty, response.ErrorMessage);
            }

            return View(user);
        }
    }
}
