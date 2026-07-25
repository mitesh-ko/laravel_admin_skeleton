<?php

namespace App\Actions\UtmSource;

use App\Models\UtmSource;

class CreateUtmSourceAction
{
    public function execute(array $data): UtmSource
    {
        return UtmSource::create($data);
    }
}
