<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DTOs\RoleDTO;
use App\Enums\PermissionName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleStoreUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->isMethod('post')) {
            return $this->user()->can(PermissionName::CREATE_ROLES->value);
        }

        if (! $this->user()->can(PermissionName::EDIT_ROLES->value)) {
            return false;
        }

        if ($this->user()->can(PermissionName::MANAGE_ALL_ROLES->value)) {
            return true;
        }

        if ($this->user()->can(PermissionName::MANAGE_OWN_ROLES->value)) {
            $roleToEdit = $this->route('role');

            return $roleToEdit && $roleToEdit->created_by === $this->user()->id;
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($this->route('role')),
            ],
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ];
    }

    public function toDTO(): RoleDTO
    {
        return new RoleDTO(
            name: $this->validated('name'),
            description: $this->validated('description'),
            permissions: $this->validated('permissions') ?? [],
        );
    }
}
