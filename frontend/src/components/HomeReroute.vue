<script setup>
    import { useRouter, useRoute } from 'vue-router';
    const router = useRouter();
    const route = useRoute();
    router.push(`/home/${route.params.page}/NO-USER`);
</script>