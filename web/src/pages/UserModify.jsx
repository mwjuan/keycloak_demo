import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export function UserModify() {
    const FormSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    })

    const form = useForm({
        defaultValues: { username: 'test', code: 'shgbit' },
        resolver: zodResolver(FormSchema),
    });
    const onSubmit = data => console.log(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="code"
                    defaultValue='test'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}