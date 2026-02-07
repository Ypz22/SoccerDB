import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 50 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBzb2NjZXIzLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzcwNDk1MDM2LCJleHAiOjE3NzA0OTg2MzZ9.lvzOT0UMoRGNDE9uJWzFZNdMZFWwshd1tZh6WSbd5Yo';

export default function () {
    const params = {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    };

    const res = http.get('http://localhost:3000/api/players', params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is less than 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
