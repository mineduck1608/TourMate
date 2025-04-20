using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IMessagesService
    {
        Message GetMessages(int id);
        IEnumerable<Message> GetAll(int pageSize, int pageIndex);
        void CreateMessages(Message messages);
        void UpdateMessages(Message messages);
        bool DeleteMessages(int id);
    }

    public class MessagesService : IMessagesService
    {
        private MessagesRepository MessagesRepository { get; set; } = new();

        public Message GetMessages(int id)
        {
            return MessagesRepository.GetById(id);
        }

        public IEnumerable<Message> GetAll(int pageSize, int pageIndex)
        {
            return MessagesRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateMessages(Message messages)
        {
            MessagesRepository.Create(messages);
        }

        public void UpdateMessages(Message messages)
        {
            MessagesRepository.Update(messages);
        }

        public bool DeleteMessages(int id)
        {
            MessagesRepository.Remove(id);
            return true;
        }
    }
}