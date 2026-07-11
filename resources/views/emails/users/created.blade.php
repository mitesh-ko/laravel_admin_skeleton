<x-mail::message>
# Welcome, {{ $user->name }}!

An account has been created for you on our platform.

Your login details are as follows:

**Email:** {{ $user->email }}<br>
**Password:** {{ $password }}

Please log in and change your password as soon as possible.

<x-mail::button :url="route('login')">
Log In
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
