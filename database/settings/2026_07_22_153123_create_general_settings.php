<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.site_name', 'Laravel Admin Skeleton');
        $this->migrator->add('general.site_active', true);
        $this->migrator->add('general.support_email', 'support@throtik.com');
    }
};
