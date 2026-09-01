<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FcmTokenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $request->user()->fcmTokens()->firstOrCreate([
            'token' => $request->token,
        ]);

        return response()->json(['message' => 'Token saved successfully.']);
    }
}
