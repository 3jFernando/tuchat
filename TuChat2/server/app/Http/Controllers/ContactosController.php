<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;

use AppCrud\Models\Contacto;
use AppCrud\Models\Mensaje;

class ContactosController extends Controller
{
  //eliminar contactos por usuario
  public function destroy($ping)
  {
    $contacto = Contacto::where('ping', '=', $ping)->get();
    if($contacto->count()) {
        foreach ($contacto as $cont => $value) {
          $value->delete();
        }
        return response()->json(['contacto' => 'eliminado']);;
    } else {
        return response()->json(['error' => 'el contacto no existe']);;
    }
  }

  public function show($usuario_id_esclavo)
  {
    $mensajes = Mensaje::where('usuario_id_esclavo', '=', $usuario_id_esclavo)
      ->orWhere('usuario_id_rey', '=', $usuario_id_esclavo)
      ->get();
    return response()->json(['mensajes' => count($mensajes)]);
  }
}
