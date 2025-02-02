<template>
    <div id="app">
        <Home v-if="isHomeShown" @convert="$refs.file_input.click()" />
        <Files v-if="isFilesShown" v-model="files" @convert_more="$refs.file_input.click()" />
        <footer>
            <div>
                <i class="material-icons">privacy_tip</i>
                <a href="https://github.com/gruppe-adler/paa.gruppe-adler.de#privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                </a>
                <span>|</span>
                <a href="https://github.com/gruppe-adler/paa.gruppe-adler.de#impressum" target="_blank" rel="noreferrer">
                    Impressum
                </a>
            </div>
            <a href="https://www.gruppe-adler.de" target="_blank" rel="noreferrer" style="opacity: 1;">www.gruppe-adler.de</a>
            <a href="https://github.com/gruppe-adler/paa.gruppe-adler.de/issues/new/choose" target="_blank" rel="noreferrer">
                <i class="material-icons">bug_report</i>
                <span>Having Issues?</span>
            </a>
        </footer>
        <Overlay @input="convertFiles"></Overlay>
        <input
            ref="file_input"
            style="display: none"
            type="file"
            multiple
            accept="image/png,image/svg+xml,image/jpeg,.paa"
            @change="onFileInput"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import HomeVue from '@/components/Home.vue';
import FilesVue from '@/components/Files.vue';
import OverlayVue from '@/components/Overlay.vue';

import { isSupportedFile } from '@/utils/file';

const suportedFormats = ['.png', '.jpg/.jpeg', '.svg', '.paa'];
const supportedHint = `\n\nWe support the following file formats:\n- ${suportedFormats.join('\n- ')}`;

@Component({
    components: {
        Home: HomeVue,
        Files: FilesVue,
        Overlay: OverlayVue
    }
})
export default class AppVue extends Vue {
    private files: File[] = [];

    private onFileInput () {
        const input = this.$refs.file_input as HTMLInputElement|undefined;
        if (!input) return;

        if (!input.files) return;

        this.convertFiles(input.files);

        // remove all files from input
        input.value = '';
    }

    private convertFiles (files: FileList) {
        if (files.length === 0) return;

        const newFiles = Array.from(files).filter(isSupportedFile);

        if (newFiles.length === 0) {
            if (files.length === 1) {
                alert(`The file you uploaded is not in a supported format.${supportedHint}`);
            } else {
                alert(`None of the files you uploaded are in a supported format.${supportedHint}`);
            }
        }

        if (newFiles.length < files.length) {
            alert(`Some of the files you uploaded are not in a supported format.${supportedHint}`);
        }

        this.files.push(...newFiles);
    }

    private get isHomeShown (): boolean {
        return this.files.length === 0;
    }

    private get isFilesShown (): boolean {
        return this.files.length > 0;
    }
}
</script>

<style lang="scss" src="@/assets/global.scss"></style>

<style lang="scss" scoped>
footer {
    height: 3rem;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--color-footer);
    color: #FFFFFF;
    display: grid;
    grid-template-columns: .5fr auto .5fr;
    justify-items: center;
    align-items: center;
    padding: 0 1.5rem;

    > * {
        display: grid;
        grid-column-gap: .25rem;
        grid-auto-flow: column;
        align-items: center;
        opacity: 0.5;

        &:first-child {
            justify-self: flex-start;
        }

        &:last-child {
            justify-self: flex-end;
        }
    }

    a:hover {
        text-decoration: underline;
    }
}
</style>
