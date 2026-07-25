<?php

declare(strict_types=1);

namespace App\Actions\Admin\Setting;

use App\DTOs\MailSettingDTO;

class UpdateMailSettingAction
{
    public function execute($settings, MailSettingDTO $data)
    {
        foreach (get_object_vars($data) as $key => $value) {
            $settings->{$key} = $value;
        }

        $settings->save();

        return $settings;
    }
}
