<script lang="ts">
    export let img;
    export let name;
</script>
<div class="h-40 rounded-md bg-neutral-600 flex flex-col justify-end items-center bg-cover bg-center" style={`background-image: url(${img});`}>
    <span class="bg-neutral-700 bg-opacity-50 backdrop-blur w-full text-center text-xl">{name}</span>
</div>