import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Loading } from '../../../shared/spinner/loading';
import { UserMasterService, UserMasterItem } from './usermaster-service';
import { RoleService } from '../role/role-service';
import { ToastService } from '../../../shared/toaster/toast-service';

@Component({
  selector: 'app-usermaster',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, FormsModule, RouterLink],
  templateUrl: './usermaster.html',
  styleUrl: './usermaster.scss',
})
export class Usermaster implements OnInit {
  allUsers: UserMasterItem[] = [];
  displayedUsers: UserMasterItem[] = [];
  allRoles: any[] = [];

  // Filtering / Search State
  searchTerm = '';
  roleFilter: string | number = 'all';

  // Pagination state
  pageSize = 5;
  pageIndex = 0;

  // Selection state
  selectedUserId: number | null = null;

  // Modal Dialog states
  private _isModalOpen = false;
  get isModalOpen(): boolean {
    return this._isModalOpen;
  }
  set isModalOpen(value: boolean) {
    this._isModalOpen = value;
    if (typeof document !== 'undefined') {
      if (value) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }
  modalTitle = 'Edit User';
  modalUser: UserMasterItem = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    houseNo: '',
    addressLine1: '',
    addressLine2: '',
    area: '',
    state: '',
    mobile: '',
    roleId: 2,
    active: 1
  };

  constructor(
    private loading: Loading,
    private userMasterService: UserMasterService,
    private roleService: RoleService,
    private toastr: ToastService,
  ) {}

  ngOnInit() {
    this._getroles();
  }

  _getroles() {
    this.loading.show();
    this.roleService.getrole().subscribe({
      next: (res) => {
        if (res.body != null && res.body.stocklst != null) {
          this.allRoles = res.body.stocklst.map((r: any) => ({
            roleId: r.roleId ?? r.roleid ?? r.RoleId,
            roleName: r.roleName ?? r.rolename ?? r.RoleName
          }));
        }
        this._getusers();
      },
      error: () => {
        this.loading.hide();
        this._getusers();
      }
    });
  }

  _getusers() {
    this.loading.show();
    this.userMasterService.getusers().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allUsers = res.body.stocklst.map((u: any) => ({
            userId: u.userId ?? u.userid ?? u.UserId,
            username: u.username ?? u.Username,
            email: u.email ?? u.Email,
            password: u.password ?? u.Password,
            houseNo: u.houseNo ?? u.houseno ?? u.HouseNo,
            addressLine1: u.addressLine1 ?? u.addressline1 ?? u.AddressLine1,
            addressLine2: u.addressLine2 ?? u.addressline2 ?? u.AddressLine2,
            area: u.area ?? u.Area,
            state: u.state ?? u.State,
            mobile: u.mobile ?? u.Mobile,
            roleId: u.roleId ?? u.roleid ?? u.RoleId,
            active: u.active ?? u.Active ?? 1
          }));
          this.updateDisplayedUsers();
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to load users list', 'error');
      }
    });
  }

  get filteredUsers(): UserMasterItem[] {
    return this.allUsers.filter(u => {
      const name = u.username || '';
      const mail = u.email || '';
      const phone = u.mobile || '';
      const matchesSearch = !this.searchTerm.trim() || 
        name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        phone.includes(this.searchTerm);

      const matchesRole = this.roleFilter === 'all' || u.roleId === Number(this.roleFilter);

      return matchesSearch && matchesRole;
    });
  }

  updateDisplayedUsers() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.updateDisplayedUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedUsers();
  }

  selectUser(userId: number) {
    if (this.selectedUserId === userId) {
      this.selectedUserId = null;
    } else {
      this.selectedUserId = userId;
    }
  }

  editUser() {
    if (this.selectedUserId) {
      const item = this.allUsers.find((u) => u.userId === this.selectedUserId);
      if (item) {
        this.modalTitle = 'Edit User Details';
        this.modalUser = {
          userId: item.userId,
          username: item.username,
          email: item.email,
          password: item.password || '',
          houseNo: item.houseNo,
          addressLine1: item.addressLine1,
          addressLine2: item.addressLine2 || '',
          area: item.area,
          state: item.state,
          mobile: item.mobile,
          roleId: item.roleId,
          active: item.active ?? 1
        };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitUser(formValue: any) {
    if (!formValue.username || !formValue.email) {
      this.toastr.show('Username and email are required', 'error');
      return;
    }

    const editPayload: UserMasterItem = {
      userId: this.modalUser.userId,
      username: formValue.username.trim(),
      email: formValue.email.trim(),
      password: formValue.password ? formValue.password.trim() : undefined,
      houseNo: formValue.houseNo.trim(),
      addressLine1: formValue.addressLine1.trim(),
      addressLine2: formValue.addressLine2 ? formValue.addressLine2.trim() : '',
      area: formValue.area.trim(),
      state: formValue.state.trim(),
      mobile: formValue.mobile.trim(),
      roleId: Number(formValue.roleId),
      active: Number(formValue.active)
    };

    this.loading.show();
    this.userMasterService.edituser(editPayload).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('User details updated successfully', 'success');
        this._getusers();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.message || 'Failed to update user details', 'error');
      }
    });
    this.closeModal();
    this.selectedUserId = null;
  }

  getRoleName(roleId: number): string {
    const role = this.allRoles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Customer';
  }

  // Dashboard Stats
  getTotalUsers(): number {
    return this.allUsers.length;
  }

  getActiveUsers(): number {
    return this.allUsers.filter(u => u.active === 1).length;
  }

  getAdminUsers(): number {
    return this.allUsers.filter(u => u.roleId === 1).length;
  }

  getCustomerUsers(): number {
    return this.allUsers.filter(u => u.roleId === 2).length;
  }
}
