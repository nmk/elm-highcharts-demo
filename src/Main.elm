module Main exposing (..)

import Array exposing (Array)
import Chart exposing (..)
import Html exposing (..)
import Html.App as Html
import Mouse exposing (Position)
import Task exposing (perform)
import Time exposing (Time, now)


type alias Model =
    { yPositions : Array ( Time, Int )
    , xPositions : Array ( Time, Int )
    }


type Msg
    = SetMousePosition Position
    | RecordMousePosition Position Time
    | NoOp


init : ( Model, Cmd Msg )
init =
    ( { xPositions = Array.empty
      , yPositions = Array.empty
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetMousePosition p ->
            let
                cmd =
                    perform (always NoOp) (RecordMousePosition p) Time.now
            in
                model ! [ cmd ]

        RecordMousePosition { x, y } t ->
            ( { model
                | xPositions = Array.push ( t, x ) model.xPositions
                , yPositions = Array.push ( t, y ) model.yPositions
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


view : Model -> Html Msg
view =
    renderLineChart << mkChart


main : Program Never
main =
    Html.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Mouse.moves SetMousePosition
