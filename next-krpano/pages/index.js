import React, { Component } from 'react';
import Head from 'next/head';
import '../assets/App.scss';
import Panzoom from 'panzoom';


class DefaultName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            krpano: null,
            editing: false,
            sku: "Tủ bếp",
            // url: "krpano/infos/tubep.jpg"
        }
    }

    componentDidMount() {
        let { embedpano } = window;

        document.onkeydown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === "e") {
                this.edit();
            }
        };
        embedpano({ swf: "krpano/tour.swf", xml: "krpano/tour.xml", target: "krpano", html5: "auto", mobilescale: 1.0, passQueryParameters: true, onready: this.krpano_onready_callback.bind(this), consolelog: true });
    }

    krpano_onready_callback(krpano_interface) {

        this.setState({ krpano: krpano_interface }, _ => {
            setTimeout(_ => {
                // this.add_hotspot("Tasa 8306", "krpano/infos/tasa-8306.jpg", 127, 52);
            }, 2000);

        });

    }

    edit = () => {
        const { krpano } = this.state;
        this.setState({ editing: !this.state.editing }, () => {
            if (this.state.editing) {
                krpano.call("autorotate.stop");
                document.querySelector("#editing").style.display = "inherit";
            } else {
                krpano.call("autorotate.start");
                document.querySelector("#editing").style.display = "none";
            }
        });
    }

    showImage = (image_url) => {
        document.querySelector("#infos").setAttribute("class", "visible");
        this.setState({ url: image_url });

        let image = document.querySelector('#info_image');

        const loaded = () => {
            image.style.maxWidth = window.innerWidth * 0.7 + 'px';
            image.style.maxHeight = window.innerHeight * 0.7 + 'px';

            image.style.left = (window.innerWidth - image.clientWidth) / 2 + 'px';
            image.style.top = (window.innerHeight - image.clientHeight) / 2 + 'px';
            const panzoom = Panzoom(image, {
                maxScale: 2
            });
            image.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
            image.removeEventListener('load', loaded);
        }

        if (image.complete) {
            loaded();
        } else {
            image.addEventListener('load', loaded);
        }

    }

    hideImage = () => {
        document.querySelector("#infos").setAttribute("class", "hidden");
    }

    add_hotspot = (code, url, x, y) => {
        const { krpano } = this.state;
        if (krpano) {
            let h = x || krpano.get("view.hlookat");
            let v = y || krpano.get("view.vlookat");
            const id = Math.round(Date.now() + Math.random());
            const hs_name = "hs_" + id;
            const layer_name = "layer_" + id;
            const layer_code = code || this.state.sku;
            const image_url = url || this.state.url;

            krpano.call("addHs(" + hs_name + ",hotspot_ani_white," + h + "," + v + "," + layer_name + "," + layer_code + ");");

            if (krpano.get("device.html5")) {
                // for HTML5 it's possible to assign JS functions directly to krpano events
                krpano.set("hotspot[" + hs_name + "].onclick", () => {

                    if (this.state.editing) {
                        this.remove_hotspot(hs_name);
                        this.remove_layer(layer_name);
                    } else {
                        this.showImage(image_url);
                    }
                });
            }
        }
    }

    remove_hotspot(hs_name) {
        const { krpano } = this.state;
        if (krpano) {
            krpano.call("removehotspot(" + hs_name + ")");
        }
    }

    remove_layer(layer_name) {
        const { krpano } = this.state;
        if (krpano) {
            krpano.call("removelayer(" + layer_name + ")");
        }
    }

    handleSkuChange = (event) => {
        this.setState({ sku: event.target.value });
    }

    handleUrlChange = (event) => {
        this.setState({ url: event.target.value });
    }

    render() {
        return (
            <div className="App">
                <Head>
                    <title>House Platform Panorama</title>

                    <script src="krpano/tour.js"></script>
                </Head>
                <div id='krpano'></div>

                <div id="editing">
                    <input type="text" id="sku" value={this.state.sku} onChange={this.handleSkuChange} />
                    <input type="text" id="url" value={this.state.url} onChange={this.handleUrlChange} />
                    <button className="button" onClick={(e) => this.add_hotspot()}>Add a Hotspot</button>
                </div>

                <div id="infos" className="hidden">
                    <div id="info_overlay" onClick={this.hideImage} onTouchEnd={this.hideImage}></div>
                    <img id="info_image" src={this.state.url} alt="" />
                </div>
            </div>
        );
    }
}

export default DefaultName;
