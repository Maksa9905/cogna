const thesisFields = `
  id
  value
  importance
  createdAt
  updatedAt
`;

const ticketFields = `
  id
  subjectId
  question
  answer
  theses {
    ${thesisFields}
  }
  createdAt
  updatedAt
`;

export const ticketFindAllQueryDocument = `
  query TicketFindAllTickets($data: FindAllTicketsRequestGql!) {
    ticketFindAllTickets(data: $data) {
      tickets {
        ${ticketFields}
      }
      totalCount
    }
  }
`;

export const ticketFindOneQueryDocument = `
  query TicketFindOneTicket($data: FindOneTicketRequestGql!) {
    ticketFindOneTicket(data: $data) {
      ticket {
        ${ticketFields}
      }
    }
  }
`;

export const ticketCreateTicketMutationDocument = `
  mutation TicketCreateTicket($data: CreateTicketRequestGql!) {
    ticketCreateTicket(data: $data) {
      ticket {
        ${ticketFields}
      }
    }
  }
`;

export const ticketUpdateTicketMutationDocument = `
  mutation TicketUpdateTicket($data: UpdateTicketRequestGql!) {
    ticketUpdateTicket(data: $data) {
      ticket {
        ${ticketFields}
      }
    }
  }
`;

export const ticketDeleteTicketMutationDocument = `
  mutation TicketDeleteTicket($data: DeleteTicketRequestGql!) {
    ticketDeleteTicket(data: $data) {
      ok
    }
  }
`;

export const ticketGenerateThesesMutationDocument = `
  mutation TicketGenerateTheses($data: GenerateThesesRequestGql!) {
    ticketGenerateTheses(data: $data) {
      ticket {
        ${ticketFields}
      }
    }
  }
`;
