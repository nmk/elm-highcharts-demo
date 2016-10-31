module Chart
    exposing
        ( LineChart
        , mkChart
        , renderLineChart
        )

import Array exposing (Array)
import Color exposing (Color, rgb)
import Color.Convert exposing (colorToHex)
import Html exposing (Html, Attribute)
import Html.Attributes as Attributes exposing (property, class)
import Json.Encode exposing (..)
import Native.Chart
import Time exposing (Time)


infixr 0 =>
(=>) : a -> b -> ( a, b )
(=>) =
    (,)


type alias DataPoint =
    ( Time, Int )


type alias Series =
    { id : String
    , name : String
    , color : Color
    , data : Array DataPoint
    }


type alias LineChart =
    { title : String
    , series : List Series
    }


mkChart : { xPositions : Array DataPoint, yPositions : Array DataPoint } -> LineChart
mkChart { xPositions, yPositions } =
    let
        xSeries =
            Series "x" "Mouse.x" (rgb 0 255 0) xPositions

        ySeries =
            Series "y" "Mouse.y" (rgb 0 0 255) yPositions
    in
        LineChart
            "Plotting Mouse Positions; Move your mouse!"
            [ xSeries, ySeries ]


lineChartToJson : LineChart -> Value
lineChartToJson c =
    let
        seriesToJson : Series -> Value
        seriesToJson s =
            object
                [ "id" => string s.id
                , "name" => string s.name
                , "color" => string (colorToHex s.color)
                , "data" => array (Array.map (\( t, n ) -> list [ float t, int n ]) s.data)
                ]

        series =
            list (List.map seriesToJson c.series)
    in
        object
            [ "title" => string c.title
            , "series" => series
            ]


data : Value -> Attribute msg
data =
    property "data"


renderLineChart : LineChart -> Html msg
renderLineChart c =
    Native.Chart.toHtml [ data (lineChartToJson c) ] []
