import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { RoleService } from './role-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface RoleItem {
  roleId: number;
  roleName: string;
  createdOn?: string;
  updatedOn?: string;
  createdBy?: number;
  updatedBy?: number;
  active?: number;
}

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  templateUrl: './role.html',
  styleUrl: './role.scss',
})
export class Role implements OnInit {
  allRoles: RoleItem[] = [];
  displayedRoles: RoleItem[] = [];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;

  // Selection state
  selectedRoleId: number | null = null;

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
  modalTitle = 'Add Role';
  modalRole = {
    roleId: 0,
    roleName: '',
    active: 1,
  };

  constructor(
    private loading: Loading,
    private roleservice: RoleService,
    private toastr: ToastService,
  ) {}

  ngOnInit() {
    this._getroles();
  }

  updateDisplayedRoles() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedRoles = this.allRoles.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRoles();
  }

  selectRole(roleId: number) {
    if (this.selectedRoleId === roleId) {
      this.selectedRoleId = null;
    } else {
      this.selectedRoleId = roleId;
    }
  }

  addRole() {
    this.modalTitle = 'Add Role';
    this.modalRole = {
      roleId: 0,
      roleName: '',
      active: 1,
    };
    this.isModalOpen = true;
  }

  editRole() {
    if (this.selectedRoleId) {
      const item = this.allRoles.find((r) => r.roleId === this.selectedRoleId);
      if (item) {
        this.modalTitle = 'Edit Role';
        this.modalRole = {
          roleId: item.roleId,
          roleName: item.roleName,
          active: item.active ?? 1,
        };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitRole(formValue: { rolename: string; active: number }) {
    if (!formValue.rolename.trim()) return;

    if (this.modalTitle === 'Add Role') {
      const newRole: RoleItem = {
        roleId: 0,
        roleName: formValue.rolename.trim(),
        active: Number(formValue.active),
      };
      this._addrole(newRole);
    } else if (this.modalTitle === 'Edit Role' && this.selectedRoleId !== null) {
      const editRole: RoleItem = {
        roleId: this.selectedRoleId,
        roleName: formValue.rolename.trim(),
        active: Number(formValue.active),
      };
      this._editrole(editRole);
    }
    this.closeModal();
    this.selectedRoleId = null;
  }

  _addrole(newRole: RoleItem) {
    this.loading.show();
    this.roleservice.addrole(newRole).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Role Added Successfully', 'success');
        }
        this._getroles();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to add role', 'error');
      },
    });
  }

  _editrole(editRole: RoleItem) {
    this.loading.show();
    this.roleservice.editrole(editRole).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Role Updated Successfully', 'success');
        }
        this._getroles();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to update role', 'error');
      },
    });
  }

  _getroles() {
    this.loading.show();
    this.roleservice.getrole().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allRoles = res.body.stocklst.map((r: any) => ({
            roleId: r.roleId ?? r.roleid ?? r.RoleId,
            roleName: r.roleName ?? r.rolename ?? r.RoleName,
            createdOn: r.createdOn ?? r.createdon,
            updatedOn: r.updatedOn ?? r.updatedon,
            createdBy: r.createdBy ?? r.createdby,
            updatedBy: r.updatedBy ?? r.updatedby,
            active: r.active ?? r.Active,
          }));
          this.updateDisplayedRoles();
        }
        this.toastr.show('Roles Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load roles', 'error');
      },
    });
  }
}
