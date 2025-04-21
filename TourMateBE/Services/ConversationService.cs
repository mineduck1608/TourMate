using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IConversationService
    {
        Conversation GetConversation(int id);
        IEnumerable<Conversation> GetAll(int pageSize, int pageIndex);
        void CreateConversation(Conversation conversation);
        void UpdateConversation(Conversation conversation);
        bool DeleteConversation(int id);
    }

    public class ConversationService : IConversationService
    {
        private ConversationRepository ConversationRepository { get; set; } = new();

        public Conversation GetConversation(int id)
        {
            return ConversationRepository.GetById(id);
        }

        public IEnumerable<Conversation> GetAll(int pageSize, int pageIndex)
        {
            return ConversationRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateConversation(Conversation conversation)
        {
            ConversationRepository.Create(conversation);
        }

        public void UpdateConversation(Conversation conversation)
        {
            ConversationRepository.Update(conversation);
        }

        public bool DeleteConversation(int id)
        {
            ConversationRepository.Remove(id);
            return true;
        }
    }
}