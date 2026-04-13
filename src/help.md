---
layout: layouts/page.html
title: Get help with Mountain Duck
permalink: /help/
metaDesc: Cyberduck for mounting volumes in the file explorer. Available for Mac and Windows.
---

<hr>

<h3>Ask for support</h3>

<p>In the app, go to &#8220;Preferences → Connection → Log → Show&#8221; and attach the selected file mountainduck.log.</p>

<div class="alt-btn">
<a href="mailto:support@mountainduck.io" class="btn">Open ticket</a>
</div><!-- btn -->

<hr>

<h3>Documentation</h3>

<div class="alt-btn">
<a href="https://forum.cyberduck.io/" class="btn">Community help</a>
<a href="https://docs.mountainduck.io/" class="btn">Docs</a>
</div><!-- btn -->

<hr>

<h3>Registration key recovery</h3>

<p>To recover a lost registration key, enter your email address:</p>

<form action="https://reg.mountainduck.io/lookup" id="recover" role="form">

<div data-layout="flex">
<div><input type="email" placeholder="Email address" id="recover-email" name="email"></div>
<div><button>Lookup</button></div>
</div><!-- layout -->

<script charset="utf-8">$(document).ready((()=>{var a={target:`#lookup-result`,clearForm:!0};$(`form#recover`).ajaxForm(a)}))</script>

</form>