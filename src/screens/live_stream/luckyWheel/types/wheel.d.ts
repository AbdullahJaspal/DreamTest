export interface ShowModelState {
  buy_ticket: boolean;
  ticket_confirmation: boolean;
  ticket_review: boolean;
}

export interface TicketData {
  createdAt: string;
  diamonds: number;
  id: number;
  no_of_tickets: number;
  ticket_no: number[];
  updatedAt: string;
  user_id: number;
}
