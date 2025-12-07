<?php

return [

    'admin_panel' => [
        'enabled' => env('ADMIN_PANEL_ENABLED', false),
        'url' => env('ADMIN_PANEL_URL', ''),
        'api_key' => env('ADMIN_PANEL_API_KEY', ''),
        'secret' => env('ADMIN_PANEL_SECRET', ''),
        'database' => [
            'host' => env('ADMIN_PANEL_DATABASE_HOST', ''),
            'port' => env('ADMIN_PANEL_DATABASE_PORT', 3306),
            'user' => env('ADMIN_PANEL_DATABASE_USER', ''),
            'password' => env('ADMIN_PANEL_DATABASE_PASSWORD', ''),
            'name' => env('ADMIN_PANEL_DATABASE_NAME', ''),
        ],
    ],

];
