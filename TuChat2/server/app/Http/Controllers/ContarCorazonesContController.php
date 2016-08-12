<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;

use AppCrud\Models\Contacto;

class ContarCorazonesContController extends Controller
{
    public function show($usuario_id_esclavo) {
      /*select count(corazon) from projectochat.contactos
      where corazon = 1 and usuario_id_esclavo = 6;*/
      $corazones = Contacto::where('usuario_id_esclavo','=',$usuario_id_esclavo)
        ->where('corazon','=',1)
        ->get();
      return response()->json(['corazones' => count($corazones)]);
    }
}
