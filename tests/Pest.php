<?php

use Dotenv\Dotenv;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Manually load .env.testing before Laravel boots
$envPath = __DIR__.'/../.env.testing';

if (! file_exists($envPath)) {
    echo "\n\033[31m[CRITICAL DANGER]\033[0m .env.testing file is missing!\n";
    echo "Running tests without it will fall back to your local .env and WIPE YOUR REAL DATABASE.\n";
    echo "Please copy .env to .env.testing and set DB_DATABASE=your_test_db before running tests.\n\n";
    exit(1);
}

$dotenv = Dotenv::createMutable(dirname($envPath), basename($envPath));
$dotenv->safeLoad();

// Automatically create the test database for MySQL connections
if (($_ENV['DB_CONNECTION'] ?? env('DB_CONNECTION')) === 'mysql') {
    $dbHost = $_ENV['DB_HOST'] ?? env('DB_HOST', '127.0.0.1');
    $dbPort = $_ENV['DB_PORT'] ?? env('DB_PORT', '3306');
    $dbUser = $_ENV['DB_USERNAME'] ?? env('DB_USERNAME', '');
    $dbPass = $_ENV['DB_PASSWORD'] ?? env('DB_PASSWORD', '');
    $dbName = $_ENV['DB_DATABASE'] ?? env('DB_DATABASE', '');

    try {
        $pdo = new PDO("mysql:host={$dbHost};port={$dbPort}", $dbUser, $dbPass);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}`");
    } catch (PDOException $e) {
        // Let Laravel handle connection errors later during execution
    }
}

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}
