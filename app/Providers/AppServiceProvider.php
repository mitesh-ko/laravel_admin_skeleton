<?php

namespace App\Providers;

use App\Services\MediaService;
use App\Services\NotificationService;
use App\Settings\GeneralSettings;
use App\Settings\MailSettings;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(NotificationService::class);
        $this->app->alias(NotificationService::class, 'notify');

        $this->app->singleton(MediaService::class);
        $this->app->alias(MediaService::class, 'media_manager');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        try {
            $settings = app(GeneralSettings::class);
            config(['app.name' => $settings->site_name]);

            $mailSettings = app(MailSettings::class);
            if ($mailSettings->mail_mailer) {
                config([
                    'mail.default' => $mailSettings->mail_mailer,
                    "mail.mailers.{$mailSettings->mail_mailer}.host" => $mailSettings->mail_host,
                    "mail.mailers.{$mailSettings->mail_mailer}.port" => $mailSettings->mail_port,
                    "mail.mailers.{$mailSettings->mail_mailer}.username" => $mailSettings->mail_username,
                    "mail.mailers.{$mailSettings->mail_mailer}.password" => $mailSettings->mail_password,
                    "mail.mailers.{$mailSettings->mail_mailer}.encryption" => $mailSettings->mail_encryption,
                    'mail.from.address' => $mailSettings->mail_from_address,
                    'mail.from.name' => $mailSettings->mail_from_name,
                ]);
            }
        } catch (\Throwable $e) {
            // Settings table might not be migrated yet, fallback to env.
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
