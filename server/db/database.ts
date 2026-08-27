import {
  User,
  Asset,
  Ticket,
  Attendance,
  LeaveRequest,
  IctDocument,
} from '../../src/types';
import { INITIAL_USERS } from '../../src/data/initialData';

class Database {
  private users: User[] = [...INITIAL_USERS];
  private assets: Asset[] = [];
  private tickets: Ticket[] = [];
  private attendances: Attendance[] = [];
  private leaves: LeaveRequest[] = [];
  private documents: IctDocument[] = [];

  public getAllUsers(): User[] {
    return this.users.map(({ password: _, ...u }) => u as User);
  }
  public findUserById(id: number): User | undefined { return this.users.find(u => u.id === id); }
  public findUserByEmail(email: string): User | undefined { return this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()); }
  public createUser(user: User): User { this.users.push(user); return user; }
  public updateUser(id: number, updates: Partial<User>): User | null { const i = this.users.findIndex(u => u.id === id); if (i < 0) return null; this.users[i] = { ...this.users[i], ...updates }; return this.users[i]; }
  public deleteUser(id: number): boolean { const n = this.users.length; this.users = this.users.filter(u => u.id !== id); return n !== this.users.length; }

  public getAllAssets(): Asset[] { return this.assets; }
  public createAsset(asset: Asset): Asset { this.assets.unshift(asset); return asset; }
  public updateAsset(id: number, updates: Partial<Asset>): Asset | null { const i = this.assets.findIndex(a => a.id === id); if (i < 0) return null; this.assets[i] = { ...this.assets[i], ...updates }; return this.assets[i]; }
  public deleteAsset(id: number): boolean { const n = this.assets.length; this.assets = this.assets.filter(a => a.id !== id); return n !== this.assets.length; }
  public bulkInsertAssets(assets: Asset[]): Asset[] { this.assets = [...assets, ...this.assets]; return this.assets; }
  public clearAssets(): void { this.assets = []; }

  public getAllTickets(): Ticket[] { return this.tickets; }
  public createTicket(ticket: Ticket): Ticket { this.tickets.unshift(ticket); return ticket; }
  public updateTicketStatus(id: number, status: Ticket['status'], notes?: string, assignment?: { assigned_to?: string; assigned_to_name?: string; assigned_to_id?: number; picked_up_at?: string }): Ticket | null { const i = this.tickets.findIndex(t => t.id === id); if (i < 0) return null; this.tickets[i] = { ...this.tickets[i], status, resolution_notes: notes !== undefined ? notes : this.tickets[i].resolution_notes, ...assignment, updated_at: new Date().toISOString() }; return this.tickets[i]; }
  public deleteTicket(id: number): boolean { const n = this.tickets.length; this.tickets = this.tickets.filter(t => t.id !== id); return n !== this.tickets.length; }
  public clearTickets(): void { this.tickets = []; }

  public getAllAttendances(): Attendance[] { return this.attendances; }
  public createAttendance(attendance: Attendance): Attendance { this.attendances.unshift(attendance); return attendance; }
  public clearAttendances(): void { this.attendances = []; }

  public getAllLeaves(): LeaveRequest[] { return this.leaves; }
  public createLeave(leave: LeaveRequest): LeaveRequest { this.leaves.unshift(leave); return leave; }
  public updateLeaveApproval(leaveId: number, stepOrder: number, approverId: number, approverName: string, status: 'Approved' | 'Rejected', signatureData: string, notes?: string): LeaveRequest | null { const i = this.leaves.findIndex(l => l.id === leaveId); if (i < 0) return null; const leave = this.leaves[i]; const a = leave.approvals.findIndex(x => x.step_order === stepOrder); if (a >= 0) leave.approvals[a] = { ...leave.approvals[a], approver_id: approverId, approver_name: approverName, status, signature_data: signatureData, approved_at: new Date().toISOString(), notes }; if (status === 'Rejected') leave.status = 'Rejected'; else if (stepOrder === 3) leave.status = 'Approved'; else leave.current_step = stepOrder + 1; return leave; }
  public clearLeaves(): void { this.leaves = []; }

  public getAllDocuments(): IctDocument[] { return this.documents; }
  public createDocument(document: IctDocument): IctDocument { this.documents.unshift(document); return document; }
  public deleteDocument(id: number): boolean { const n = this.documents.length; this.documents = this.documents.filter(d => d.id !== id); return n !== this.documents.length; }
  public clearDocuments(): void { this.documents = []; }
}

export const db = new Database();
