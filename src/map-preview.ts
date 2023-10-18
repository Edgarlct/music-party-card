import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import L from "leaflet";

@customElement('leaflet-map')
export class LeafletMap extends LitElement {

    @property({ type: String }) path: string = '';
    @property({ type: String }) type: 'GPX' | 'GTFS' = 'GPX';
    @property({ type: Number }) height: number = 400;
    @property({ type: Number }) width: number = 600;

    static styles = css`
        :host {
            display: block;
        }
        #map {
            background: lightgray;
            width: var(--map-width, 600px);
            height: var(--map-height, 400px);
        }
    `;

    @property({ type: Object})
    center = { lat: 51.505, lng: -0.09 };
    @property({ type: Number})
    zoom = 13;

    private map?: L.Map;

    firstUpdated() {
        this.map = L.map(this.shadowRoot!.getElementById('map')!).setView([this.center.lat, this.center.lng], this.zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('width') || changedProperties.has('height')) {
            this.style.setProperty('--map-width', `${this.width}px`);
            this.style.setProperty('--map-height', `${this.height}px`);
        }
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
            <div id="map"></div>
            <button @click="${this.download}">Download ${this.type} from ${this.path}</button>
        `;
    }

    download() {
        if(this.path) {
            window.open(this.path);
        }
    }
}
