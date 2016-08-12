<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;
use AppCrud\Models\Contacto;

class ContarContContactoController extends Controller
{

  public function show($usuario_id_rey)
  {
    $contactos = Contacto::where('usuario_id_rey', '=', $usuario_id_rey)->get();
    return response()->json(['contactos' => count($contactos)]);
  }

}
