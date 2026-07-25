<?php

namespace App\Http\Requests\Admin;

use App\Enums\PermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveUtmSourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('post')) {
            return $this->user()->can(PermissionName::CREATE_UTM_SOURCES->value);
        }

        return $this->user()->can(PermissionName::EDIT_UTM_SOURCES->value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $codeRule = Rule::unique('utm_sources', 'code');

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $codeRule->ignore($this->utm_source);
        }

        return [
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:255',
                $codeRule,
            ],
            'utm_medium' => 'required|string|max:255',
            'utm_campaign' => 'required|string|max:255',
            'utm_content' => 'nullable|string|max:255',
            'utm_term' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
