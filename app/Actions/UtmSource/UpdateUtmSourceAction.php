<?php

namespace App\Actions\UtmSource;

use App\Models\UtmSource;

class UpdateUtmSourceAction
{
    public function execute(UtmSource $utmSource, array $data): UtmSource
    {
        $utmSource->update($data);

        return $utmSource;
    }
}
