import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styles: []
})
export class GalleryComponent implements OnInit, OnChanges {
    @Input() images!: string[];
    selectedImage!: string;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    ngOnChanges(): void {
        if (this.hasImages) {
            this.selectedImage = this.images[0];
        }
    }

    changeSelectedImage(imageUrl: string) {
        this.selectedImage = imageUrl;
    }

    get hasImages() {
        return this.images?.length > 0;
    }
}
