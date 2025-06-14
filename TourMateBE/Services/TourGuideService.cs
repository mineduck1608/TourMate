﻿using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface ITourGuideService
    {
        Task<TourGuide> GetTourGuideByAccId(int accId);
        Task<TourGuide> GetTourGuide(int id);
        Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string phone);
        bool DeleteTourGuide(int id);
        Task<bool> CreateTourGuide(TourGuide tourguide);
        Task<bool> UpdateTourGuide(TourGuide tourguide);
        Task<TourGuide> GetTourGuideByPhone(string phone);
        Task<bool> UpdateTourGuideClient(TourGuide tourGuide);
        Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId);
        Task<bool> ChangePicture(int id, string fieldToChange, string newValue);
        Task<List<TourGuide>> GetOtherTourGuidesAsync(int tourGuideId, int pageSize);
        Task<bool> ChangePassword(int id, string password);
        Task<List<TourGuide>> GetTourGuidesByAreaAsync(int areaId, int pageSize);
        Task<TourGuideIdAndName> GetTourGuideByAccountIdAsync(int accountId);
    }
    public class TourGuideService : ITourGuideService
    {
        private readonly TourGuideRepository _repository;

        public TourGuideService(TourGuideRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<TourGuideIdAndName> GetTourGuideByAccountIdAsync(int accountId)
        {
            return await _repository.GetTourGuideByAccountIdAsync(accountId);
        }

        public async Task<TourGuide> GetTourGuideByAccId(int accId)
        {
            return await _repository.GetByAccId(accId);
        }
        public async Task<TourGuide> GetTourGuide(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex)
        {
            return await _repository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string phone)
        {
            return await _repository.FilterByPhone(pageSize, pageIndex, phone);
        }

        public async Task<bool> CreateTourGuide(TourGuide tourguide)
        {
            return await _repository.CreateAsync(tourguide);
        }

        public async Task<bool> UpdateTourGuide(TourGuide tourguide)
        {
            return await _repository.UpdateAsync(tourguide);
        }

        public bool DeleteTourGuide(int id)
        {
            _repository.Remove(id);
            return true;
        }

        public async Task<TourGuide> GetTourGuideByPhone(string phone)
        {
            return await _repository.GetByPhone(phone);
        }

        public async Task<bool> UpdateTourGuideClient(TourGuide tourGuide)
        {
            return await _repository.UpdateProfile(tourGuide);
        }

        public async Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId)
        {
            return await _repository.GetList(pageSize, pageIndex, name, areaId);
        }

        public async Task<bool> ChangePicture(int id, string fieldToChange, string newValue)
        {
            return await _repository.ChangePicture(id, fieldToChange, newValue);
        }

        public async Task<List<TourGuide>> GetOtherTourGuidesAsync(int tourGuideId, int pageSize)
        {
            return await _repository.GetOtherTourGuidesAsync(tourGuideId, pageSize);
        }
        public async Task<bool> ChangePassword(int id, string password)
        {
            return await _repository.ChangePassword(id, password);
        }
        public async Task<List<TourGuide>> GetTourGuidesByAreaAsync(int areaId, int pageSize)
        {
            return await _repository.GetTourGuidesByAreaAsync(areaId, pageSize);
        }
    }
}
