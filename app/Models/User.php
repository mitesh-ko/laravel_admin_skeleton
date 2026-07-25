<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use OwenIt\Auditing\Auditable as AuditableTrait;
use OwenIt\Auditing\Contracts\Auditable;
use Rappasoft\LaravelAuthenticationLog\Traits\AuthenticationLoggable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'created_by', 'assigned_to'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token', 'impersonation_token'])]
class User extends Authenticatable implements Auditable, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use AuditableTrait, AuthenticationLoggable, HasFactory, HasRoles, HasUlids, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    public const GLOBAL_SEARCH = [
        [
            'key' => 'name',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
        [
            'key' => 'email',
            'op' => 'like',
            'mask' => '%{value}%',
        ],
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Perform any actions required after the model boots.
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->impersonation_token)) {
                $user->generateImpersonationToken();
            }
        });
    }

    /**
     * Generate a new impersonation token for the user.
     */
    public function generateImpersonationToken(): void
    {
        $this->impersonation_token = strtoupper(Str::random(4));
    }

    /**
     * Get the user that created this user.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user this user is assigned to.
     */
    public function assignedToUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get users assigned to this user.
     */
    public function assignedUsers()
    {
        return $this->hasMany(User::class, 'assigned_to');
    }

    /**
     * Get roles assigned to this user.
     */
    public function assignedRoles()
    {
        return $this->hasMany(Role::class, 'assigned_to');
    }

    /**
     * Get a cached list of basic user data.
     */
    public static function getCachedList()
    {
        return cache()->remember('users.select', now()->addWeek(), fn () => self::select('id', 'name')->get()->toArray());
    }

    public function utmVisits()
    {
        return $this->hasMany(UtmVisit::class);
    }
}
