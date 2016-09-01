<?php

Route::get('/', function () { return view('welcome'); });
Route::group(['middleware' => ['web']], function () { });


/*RUTAS REFT FULL*/
//api para los usuarios
Route::resource('usuarios', 'UsuariosController', [
  'only' => ['index', 'store', 'update']
]);
//actualizar fotografia del perfil del usuario
Route::resource('actualizarfotografia', 'FotoUsuarioController', [
  'only'  => ['update']
]);
//eliminar contactos por usuario
Route::resource('contactos', 'ContactosController', [
  'only'  => ['destroy','show']
]);
//gardar mensajes
Route::resource('mensajes', 'MensajesController', [
  'only'  => ['store', 'show', 'destroy']
]);
//contar contactos de los contactos
Route::resource('contarcontcontacto', 'ContarContContactoController', [
  'only'  => ['show']
]);
//contar corazones de contacto
Route::resource('contarcorazonescontacto', 'ContarCorazonesContController', [
  'only'  => ['show']
]);
//notificaciones de mensajes para los usuarios de sus contactos
Route::resource('notificaciones', 'NotificacionesController', [
  'only'  => ['store','show','destroy']
]);



/*RUTAS PARA PROVESOS VASICOS*/
//inicar sesion
Route::get('iniciarsesion', 'UsuariosController@login');
//agregar contactos por usuario
Route::post('agregarContactos', 'UsuariosController@agregarContactos');
//listar contactos por usuario
Route::get('listadecontactos', 'UsuariosController@listadecontactos');
//actualizar datos del usuario
Route::put('actualizardatos', 'UsuariosController@actualizardatos');
Route::put('actualizarentuchat', 'UsuariosController@actualizarentuchat');
//descargar img de los contactos
Route::get('descargarImgDelContacto/{foto}', 'FotoUsuarioController@descargarImgDelContacto');
//descargar img de los sms
Route::get('descargarImgDelSMS/{foto}', 'FotoUsuarioController@descargarImgDelSMS');


Route::get('showultimo/{ping}', 'MensajesController@showultimo');
