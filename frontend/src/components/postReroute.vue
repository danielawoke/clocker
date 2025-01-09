<script setup>
    import { useRouter, useRoute } from 'vue-router';
    const router = useRouter();
    const route = useRoute();
    router.push(`/post/${route.params.title}/NO-USER`);
</script>